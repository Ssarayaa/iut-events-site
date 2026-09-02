package iut.events.site.controller;

import iut.events.site.model.*;
import iut.events.site.repository.*;
import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
// Controleur principal des evenements : expose les routes CRUD utilisees par le front React.
public class EventController {

    private final EventRepository eventRepository;
    private final MaterialResourceRepository materialResourceRepository;
    private final StatisticsRepository statisticsRepository;
    private final ParticipationRepository participationRepository;
    private final UserRepository userRepository;
    private final EventTypeRepository eventTypeRepository;
    private final StudentGroupRepository studentGroupRepository;

    public EventController(EventRepository eventRepository,
                           MaterialResourceRepository materialResourceRepository,
                           StatisticsRepository statisticsRepository,
                           ParticipationRepository participationRepository,
                           UserRepository userRepository,
                           EventTypeRepository eventTypeRepository,
                           StudentGroupRepository studentGroupRepository) {
        this.eventRepository = eventRepository;
        this.materialResourceRepository = materialResourceRepository;
        this.statisticsRepository = statisticsRepository;
        this.participationRepository = participationRepository;
        this.userRepository = userRepository;
        this.eventTypeRepository = eventTypeRepository;
        this.studentGroupRepository = studentGroupRepository;
    }

    // ===== GET =====
    @GetMapping
    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        events.forEach(event -> {
            Hibernate.initialize(event.getParticipations());
            event.getParticipations().forEach(p -> Hibernate.initialize(p.getUser()));
        });
        return events;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        Hibernate.initialize(event.getParticipations());
        event.getParticipations().forEach(p -> Hibernate.initialize(p.getUser()));
        return ResponseEntity.ok(event);
    }

    // ===== POST avec image =====
    @PostMapping(consumes = { "multipart/form-data" })
    public Event createEventWithImage(@RequestPart("event") Event event,
                                      @RequestPart(value = "image", required = false) MultipartFile image) {

        if (event.getGroupe() != null && event.getGroupe().getId() != null) {
            StudentGroup groupe = studentGroupRepository.findById(event.getGroupe().getId()).orElse(null);
            event.setGroupe(groupe);
        }

        if (event.getReferent() != null && event.getReferent().getId() != null) {
            User referent = userRepository.findById(event.getReferent().getId()).orElse(null);
            event.setReferent(referent);
        }

        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            event.setImageUrl(imageUrl);
        }

        return eventRepository.save(event);
    }

    // ===== POST sans image (fallback) =====
    @PostMapping(consumes = { "application/json" })
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    // ===== PUT avec image =====
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<Event> updateEventWithImage(@PathVariable Long id,
                                                      @RequestPart("event") Event updatedEvent,
                                                      @RequestPart(value = "image", required = false) MultipartFile image) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        applyCommonFields(existingEvent, updatedEvent);

        if (updatedEvent.getGroupe() != null && updatedEvent.getGroupe().getId() != null) {
            StudentGroup groupe = studentGroupRepository.findById(updatedEvent.getGroupe().getId()).orElse(null);
            existingEvent.setGroupe(groupe);
        } else {
            existingEvent.setGroupe(null);
        }

        if (updatedEvent.getReferent() != null && updatedEvent.getReferent().getId() != null) {
            User referent = userRepository.findById(updatedEvent.getReferent().getId()).orElse(null);
            existingEvent.setReferent(referent);
        } else {
            existingEvent.setReferent(null);
        }

        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            existingEvent.setImageUrl(imageUrl);
        }

        return ResponseEntity.ok(eventRepository.save(existingEvent));
    }

    // ===== PUT sans image (fallback) =====
    @PutMapping(value = "/{id}", consumes = { "application/json" })
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        applyCommonFields(existingEvent, updatedEvent);

        if (updatedEvent.getReferent() != null && updatedEvent.getReferent().getId() != null) {
            existingEvent.setReferent(userRepository.findById(updatedEvent.getReferent().getId()).orElse(null));
        }
        if (updatedEvent.getType() != null && updatedEvent.getType().getId() != null) {
            existingEvent.setType(eventTypeRepository.findById(updatedEvent.getType().getId()).orElse(null));
        }
        if (updatedEvent.getGroupe() != null && updatedEvent.getGroupe().getId() != null) {
            existingEvent.setGroupe(studentGroupRepository.findById(updatedEvent.getGroupe().getId()).orElse(null));
        }

        return ResponseEntity.ok(eventRepository.save(existingEvent));
    }

    // ===== DELETE =====
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }
        eventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ===== METHODE UTILITAIRE : champs communs aux deux PUT =====
    private void applyCommonFields(Event existing, Event updated) {
        existing.setTitre(updated.getTitre());
        existing.setDescription(updated.getDescription());
        existing.setDateDebut(updated.getDateDebut());
        existing.setDateFin(updated.getDateFin());
        existing.setHeureDebut(updated.getHeureDebut());
        existing.setHeureFin(updated.getHeureFin());   // ← heure de fin
        existing.setLieu(updated.getLieu());
        existing.setCategorie(updated.getCategorie());
        existing.setBudgetPrevu(updated.getBudgetPrevu());
        existing.setBudgetReel(updated.getBudgetReel());
        existing.setRessourcesMaterielles(updated.getRessourcesMaterielles());
        existing.setProblemesRencontres(updated.getProblemesRencontres());
    }

    // ===== METHODE POUR SAUVEGARDER L'IMAGE =====
    private String saveImage(MultipartFile image) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, image.getBytes());
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la sauvegarde de l'image", e);
        }
    }
}