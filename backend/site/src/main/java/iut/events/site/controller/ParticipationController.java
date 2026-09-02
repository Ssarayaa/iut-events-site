package iut.events.site.controller;

import iut.events.site.model.Event;
import iut.events.site.model.Participation;
import iut.events.site.model.User;
import iut.events.site.repository.EventRepository;
import iut.events.site.repository.ParticipationRepository;
import iut.events.site.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/participations")
@CrossOrigin(origins = "http://localhost:5173")
// Controleur des inscriptions : il relie un utilisateur a un evenement via une participation.
public class ParticipationController {

    // Repositories necessaires pour trouver l'utilisateur, l'evenement et sauvegarder la participation.
    private final ParticipationRepository participationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    // Constructeur d'injection appele par Spring au demarrage.
    public ParticipationController(ParticipationRepository participationRepository,
                                   UserRepository userRepository,
                                   EventRepository eventRepository) {
        this.participationRepository = participationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    // Cree une participation pour un couple utilisateur/evenement.
    @PostMapping("/inscrire")
    public Participation inscrireUser(@RequestBody Map<String, Long> requestData) {
        Long userId = requestData.get("userId");
        Long eventId = requestData.get("eventId");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Événement non trouvé"));

        // Vérifier si déjà inscrit
        boolean alreadyExists = participationRepository.findAll().stream()
                .anyMatch(p -> p.getUser().getId().equals(userId) && p.getEvent().getId().equals(eventId));

        if (alreadyExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous êtes déjà inscrit à cet événement");
        }

        Participation participation = new Participation();
        participation.setUser(user);
        participation.setEvent(event);
        participation.setDateInscription(LocalDateTime.now());
        participation.setStatut(Participation.Statut.INSCRIT);

        return participationRepository.save(participation);
    }

    // Supprime la participation existante pour desinscrire l'utilisateur.
    @DeleteMapping("/desinscrire")
    public void desinscrireUser(@RequestParam Long userId, @RequestParam Long eventId) {
        Participation participation = participationRepository.findAll().stream()
                .filter(p -> p.getUser().getId().equals(userId) && p.getEvent().getId().equals(eventId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participation non trouvée"));

        participationRepository.delete(participation);
    }
}
