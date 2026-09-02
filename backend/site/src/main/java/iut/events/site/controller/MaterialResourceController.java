package iut.events.site.controller;

import iut.events.site.model.Event;
import iut.events.site.model.MaterialResource;
import iut.events.site.repository.EventRepository;
import iut.events.site.repository.MaterialResourceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
// Controleur des ressources materielles : permet de lister, ajouter, modifier et supprimer
// les ressources liees a un evenement depuis le front sans passer par le code.
public class MaterialResourceController {

    private final MaterialResourceRepository materialResourceRepository;
    private final EventRepository eventRepository;

    public MaterialResourceController(MaterialResourceRepository materialResourceRepository,
                                      EventRepository eventRepository) {
        this.materialResourceRepository = materialResourceRepository;
        this.eventRepository = eventRepository;
    }

    // Liste toutes les ressources d'un événement donné
    @GetMapping("/event/{eventId}")
    public List<MaterialResource> getByEvent(@PathVariable Long eventId) {
        return materialResourceRepository.findByEventId(eventId);
    }

    // Crée une ressource et l'associe à l'événement
    @PostMapping
    public ResponseEntity<MaterialResource> create(@RequestBody Map<String, Object> body) {
        Long eventId = Long.valueOf(body.get("eventId").toString());
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Événement non trouvé"));

        MaterialResource resource = new MaterialResource();
        resource.setNom(body.get("nom").toString());
        resource.setQuantite(Integer.valueOf(body.get("quantite").toString()));
        resource.setCoutUnitaire(Double.valueOf(body.get("coutUnitaire").toString()));
        resource.setEvent(event);

        return ResponseEntity.status(HttpStatus.CREATED).body(materialResourceRepository.save(resource));
    }

    // Met à jour une ressource existante
    @PutMapping("/{id}")
    public ResponseEntity<MaterialResource> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        MaterialResource resource = materialResourceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ressource non trouvée"));

        resource.setNom(body.get("nom").toString());
        resource.setQuantite(Integer.valueOf(body.get("quantite").toString()));
        resource.setCoutUnitaire(Double.valueOf(body.get("coutUnitaire").toString()));

        return ResponseEntity.ok(materialResourceRepository.save(resource));
    }

    // Supprime une ressource
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!materialResourceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ressource non trouvée");
        }
        materialResourceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}