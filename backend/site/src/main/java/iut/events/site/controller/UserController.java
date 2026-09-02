package iut.events.site.controller;

import iut.events.site.model.User;
import iut.events.site.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
// Controleur utilisateur : gere la connexion, la creation de compte et la liste des utilisateurs.
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ NOUVEAU : Récupérer tous les utilisateurs
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Route simple de simulation de Login
    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(email) && u.getMotDePasse().equals(password))
                .findFirst();

        if (userOpt.isPresent()) {
            return userOpt.get();
        } else {
            throw new RuntimeException("Identifiants incorrects !");
        }
    }

    // Route pour s'inscrire (créer un compte)
    @PostMapping("/register")
    public User register(@RequestBody User newUser) {
        if (newUser.getRole() == null || newUser.getRole().trim().isEmpty()) {
            newUser.setRole("ETUDIANT");
        } else if (newUser.getRole().equalsIgnoreCase("ENSEIGNANT")) {
            newUser.setRole("Enseignant");
        }
        return userRepository.save(newUser);
    }
}