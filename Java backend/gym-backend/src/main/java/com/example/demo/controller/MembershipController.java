package com.example.demo.controller;
import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.MembershipPlan;
import com.example.demo.repository.MembershipRepository;

@RestController
@RequestMapping("/api/membershipPlans")

public class MembershipController {

    private final MembershipRepository membershipRepository;

    public MembershipController(MembershipRepository membershipRepository){
        this.membershipRepository = membershipRepository;

    }

    @GetMapping ("/getMembershipPlan")
    public List<MembershipPlan> getAllMembershipPlans(){
        return membershipRepository.findAll();
    }

    @PostMapping ("/addMembershipPlan")
    public MembershipPlan addMembershipPlan(@RequestBody MembershipPlan membershipPlan){
        return membershipRepository.save(membershipPlan);

    }
    
}
