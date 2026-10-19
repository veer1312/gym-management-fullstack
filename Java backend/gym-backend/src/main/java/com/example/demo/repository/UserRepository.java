package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);

    @Query("""
        SELECT u
        FROM User u
        WHERE
            (
                :search IS NULL
                OR :search = ''
                OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                OR u.contactNumber LIKE CONCAT('%', :search, '%')
            )
        AND
            (
                :status IS NULL
                OR :status = ''
                OR
                (
                    :status = 'Active'
                    AND u.membershipStartDate <= CURRENT_DATE
                    AND (
                        u.membershipEndDate IS NULL
                        OR u.membershipEndDate >= CURRENT_DATE
                    )
                )
                OR
                (
                    :status = 'Inactive'
                    AND u.membershipStartDate > CURRENT_DATE
                )
                OR
                (
                    :status = 'Expired'
                    AND u.membershipEndDate < CURRENT_DATE
                )
            )
        """)
    Page<User> findUsersWithFilters(
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable);
}