package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.MembershipPlan;

public interface MembershipRepository extends JpaRepository<MembershipPlan, Long> {
    

}