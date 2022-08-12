package com.tokenbid.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tokenbid.models.User;
import com.tokenbid.repositories.UserRepository;

@Service
public class UserService implements IService<User> {
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public int add(User item) {
        return userRepository.save(item).getUserId();
    }

    @Override
    public void update(User item) {
        if (userRepository.findById(item.getUserId()).isPresent()) {
            userRepository.save(item);
        }
    }

    @Override
    public void delete(int id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
        }
    }

    @Override
    public User getById(int id) {
        if (userRepository.findById(id).isPresent()) {
            return userRepository.findById(id).get();
        }

        return null;
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }

    /**
     * If the user is found, and not verified already, it verifies the email and add
     * 250 free tokens to the user's account.
     * 
     * @param id The user's id.
     * @return True if the user was found and verified, false otherwise.
     */
    public boolean verifyUserAndAddFreeTokens(int id) {
        if (userRepository.findById(id).isPresent() &&
                !userRepository.findById(id).get().isEmailVerified()) {
            User user = getById(id);
            user.setEmailVerified(true);
            user.setTokens(250);
            userRepository.save(user);
            return true;
        }

        return false;
    }
}
