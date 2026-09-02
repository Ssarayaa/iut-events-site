package iut.events.site.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// Type d'evenement reutilisable pour classer les evenements.
@Entity
@Table(name = "event_types")
@Getter
@Setter
public class EventType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String libelle; // Culturel, Pédagogique, Sportif, NDI, JPO, Hackathon
}
