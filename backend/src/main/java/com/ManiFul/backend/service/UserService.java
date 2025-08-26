package com.ManiFul.backend.service;

import com.ManiFul.backend.model.Category;
import com.ManiFul.backend.model.CustomUserDetails;
import com.ManiFul.backend.model.Type;
import com.ManiFul.backend.model.User;
import com.ManiFul.backend.repository.CategoryRepository;
import com.ManiFul.backend.repository.TypeRepository;
import com.ManiFul.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TypeRepository typeRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       CategoryRepository categoryRepository,
                       TypeRepository typeRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.typeRepository = typeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUser(Integer id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null); // Or throw an exception if preferred
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        return new CustomUserDetails(user);
    }

    @Transactional
    public User createUser(String username, String email, String password, boolean google) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setGoogle(google);
        userRepository.save(user);

        Long userId = (long) user.getId();

        DEFAULT_DATA.forEach((categoryName, typeSeeds) -> {
            Category category = new Category();
            category.setName(categoryName);
            category.setUserId(userId);

            // Set the expense field for the Category
            boolean isExpenseCategory = !"General Income".equals(categoryName);
            category.setExpense(isExpenseCategory);

            categoryRepository.save(category);

            typeSeeds.forEach(typeSeed -> {
                Type type = new Type();
                type.setUserId(userId);
                type.setCategory(category);
                type.setName(typeSeed.name());
                type.setExpense(typeSeed.expense()); // This sets expense for Type, not Category
                typeRepository.save(type);
            });
        });

        return user;
    }

    // Default category/type structure
    private static final Map<String, List<TypeSeed>> DEFAULT_DATA = Map.of(
            "Groceries", List.of(
                    new TypeSeed("Food", true),
                    new TypeSeed("Beverages", true),
                    new TypeSeed("Sweets", true),
                    new TypeSeed("Frozen food", true)
            ),
            "Utility", List.of(
                    new TypeSeed("Household items", true),
                    new TypeSeed("Pet supplies", true),
                    new TypeSeed("Clothing", true),
                    new TypeSeed("Electronics", true)
            ),
            "Travel", List.of(
                    new TypeSeed("Public transport", true),
                    new TypeSeed("Gas", true),
                    new TypeSeed("Flights", true),
                    new TypeSeed("Car rentals", true),
                    new TypeSeed("Hotels", true)
            ),
            "Entertainment", List.of(
                    new TypeSeed("Movies", true),
                    new TypeSeed("Concerts", true),
                    new TypeSeed("Gambling", true),
                    new TypeSeed("Games", true),
                    new TypeSeed("Books", true)
            ),
            "Other", List.of(
                    new TypeSeed("Subscriptions", true),
                    new TypeSeed("Alcohol", true),
                    new TypeSeed("Nicotine", true),
                    new TypeSeed("Medicine", true)
            ),
            "General Expenses", List.of(
                    new TypeSeed("Rent / Mortgage", true),
                    new TypeSeed("Loan payments", true),
                    new TypeSeed("Household utilities", true),
                    new TypeSeed("Other bills", true)
            ),
            "General Income", List.of(
                    new TypeSeed("Income", false)
            )
    );

    private record TypeSeed(String name, boolean expense) {}
}
