package com.ManiFul.backend.service;

import com.ManiFul.backend.model.User;
import com.ManiFul.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getUser(Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null); // Or throw an exception if preferred
    }
}
