package com.example.demo.service;

// import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.CreateMemberRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.MembershipPlan;
import com.example.demo.entity.Payment;
import com.example.demo.entity.User;
import com.example.demo.repository.MembershipRepository;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.MemberListResponse;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class UserService {

        private final UserRepository userRepository;
        private final PaymentRepository paymentRepository;
        private final MembershipRepository membershipRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;

        public UserService(
                        UserRepository userRepository,
                        PaymentRepository paymentRepository,
                        MembershipRepository membershipRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {

                this.userRepository = userRepository;
                this.paymentRepository = paymentRepository;
                this.membershipRepository = membershipRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
        }

        public boolean emailExists(String email) {
                if (email == null || email.isBlank()) {
                        return false;
                }

                return userRepository.existsByEmailIgnoreCase(email.trim());
        }

        // =====================================================
        // CREATE MEMBER + PAYMENT
        // =====================================================

        @Transactional
        public void createMember(CreateMemberRequest request) {

                // 1. Check email
                Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

                if (existingUser.isPresent()) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Email already exists");
                }

                // 2. Check membership plan
                MembershipPlan membershipPlan = membershipRepository.findById(request.getMembershipId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Membership plan not found"));

                // 3. Create User
                User user = new User();

                user.setName(request.getName());
                user.setGender(request.getGender());
                user.setDateOfBirth(request.getDateOfBirth());
                user.setEmail(request.getEmail());

                // Password is optional
                if (request.getPassword() != null
                                && !request.getPassword().isBlank()) {

                        user.setPassword(
                                        passwordEncoder.encode(request.getPassword()));
                }

                user.setContactNumber(request.getContactNumber());
                user.setAddress(request.getAddress());

                user.setMembershipId(membershipPlan.getId());
                user.setMembershipStartDate(
                                request.getMembershipStartDate());
                user.setMembershipEndDate(
                                request.getMembershipEndDate());

                user.setEmergencyContactName(
                                request.getEmergencyContactName());

                user.setEmergencyRelationship(
                                request.getEmergencyRelationship());

                user.setEmergencyContactNumber(
                                request.getEmergencyContactNumber());

                // 4. Save User
                User savedUser = userRepository.save(user);

                // 5. Create Payment
                Payment payment = new Payment();

                payment.setUserId(savedUser.getId());
                payment.setAmount(request.getAmount());
                payment.setPaymentMethod(request.getPaymentMethod());
                payment.setPaymentDate(
                                java.time.LocalDate.now());

                // 6. Save Payment
                paymentRepository.save(payment);
        }

        // =====================================================
        // GET ALL USERS
        // =====================================================

        public Page<MemberListResponse> getAllUsers(
                        String search,
                        String status,
                        String paymentStatus,
                        Pageable pageable) {

                Page<User> users = userRepository.findUsersWithFilters(
                                search,
                                status,
                                pageable);

                return users.map(user -> {

                        // Get membership plan name
                        Optional<MembershipPlan> membershipPlan = membershipRepository.findById(user.getMembershipId());

                        String membershipName = "Unknown";

                        if (membershipPlan.isPresent()
                                        && membershipPlan.get().getMembership() != null) {

                                membershipName = membershipPlan.get().getMembership();
                        }

                        // Get latest payment
                        Optional<Payment> latestPayment = paymentRepository
                                        .findFirstByUserIdOrderByPaymentDateDescIdDesc(
                                                        user.getId());

                        Double amount = latestPayment.isPresent()
                                        ? latestPayment.get().getAmount()
                                        : null;

                        LocalDate paymentDate = latestPayment.isPresent()
                                        ? latestPayment.get().getPaymentDate()
                                        : null;

                        String paymentMethod = latestPayment.isPresent()
                                        ? latestPayment.get().getPaymentMethod()
                                        : null;

                        // Calculate payment status
                        String calculatedPaymentStatus = latestPayment.isPresent()
                                        ? "Paid"
                                        : "Pending";

                        // Calculate membership status
                        LocalDate today = LocalDate.now();

                        boolean notStarted = user.getMembershipStartDate() != null
                                        && user.getMembershipStartDate().isAfter(today);

                        boolean expired = user.getMembershipEndDate() != null
                                        && user.getMembershipEndDate().isBefore(today);

                        String calculatedStatus;

                        if (expired) {
                                calculatedStatus = "Expired";
                        } else if (notStarted) {
                                calculatedStatus = "Inactive";
                        } else {
                                calculatedStatus = "Active";
                        }

                        // Return member response
                        return new MemberListResponse(
                                        user.getId(),
                                        user.getName(),
                                        user.getEmail(),
                                        user.getContactNumber(),
                                        membershipName,
                                        user.getMembershipStartDate(),
                                        user.getMembershipEndDate(),
                                        amount,
                                        paymentDate,
                                        paymentMethod,
                                        calculatedPaymentStatus,
                                        calculatedStatus);
                });
        }

        // =====================================================
        // GET USER BY ID
        // =====================================================

        public User getUserById(Long id) {

                return userRepository.findById(id)
                                .orElse(null);
        }

        // =====================================================
        // UPDATE USER
        // =====================================================

        public void updateUser(Long id, User user) {

                User existingUser = userRepository.findById(id).orElse(null);

                if (existingUser == null) {

                        throw new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "User not found");
                }

                Optional<User> userWithEmail = userRepository.findByEmail(user.getEmail());

                if (userWithEmail.isPresent()
                                && !userWithEmail.get().getId().equals(id)) {

                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Email already exists");
                }

                existingUser.setName(user.getName());
                existingUser.setEmail(user.getEmail());
                existingUser.setContactNumber(user.getContactNumber());
                existingUser.setAddress(user.getAddress());
                existingUser.setGender(user.getGender());
                existingUser.setDateOfBirth(user.getDateOfBirth());

                existingUser.setMembershipId(
                                user.getMembershipId());

                existingUser.setMembershipStartDate(
                                user.getMembershipStartDate());

                existingUser.setMembershipEndDate(
                                user.getMembershipEndDate());

                existingUser.setEmergencyContactName(
                                user.getEmergencyContactName());

                existingUser.setEmergencyRelationship(
                                user.getEmergencyRelationship());

                existingUser.setEmergencyContactNumber(
                                user.getEmergencyContactNumber());

                userRepository.save(existingUser);
        }

        // =====================================================
        // DELETE USER
        // =====================================================

        public void deleteUser(Long id) {

                User existingUser = userRepository.findById(id).orElse(null);

                if (existingUser == null) {

                        throw new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "User not found");
                }

                userRepository.delete(existingUser);
        }

        // =====================================================
        // LOGIN
        // =====================================================

        public LoginResponse login(
                        String email,
                        String password) {

                Optional<User> existingUser = userRepository.findByEmail(email);

                if (existingUser.isEmpty()) {

                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid email or password");
                }

                User user = existingUser.get();

                if (user.getPassword() == null
                                || user.getPassword().isBlank()) {

                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Password login is not available for this user");
                }

                boolean passwordMatches = passwordEncoder.matches(
                                password,
                                user.getPassword());

                if (!passwordMatches) {

                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid email or password");
                }

                String token = jwtService.generateToken(
                                user.getId(),
                                user.getEmail());

                return new LoginResponse(
                                true,
                                "Login successful",
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                token);
        }
}