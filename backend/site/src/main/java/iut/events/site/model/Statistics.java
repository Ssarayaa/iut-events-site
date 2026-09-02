package iut.events.site.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

// Statistiques associees a un evenement pour suivre participation, budget et problemes.
@Entity
@Table(name = "statistics")
@Getter
@Setter
public class Statistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer nbParticipants;
    private Double ecartBudget;

    @Column(columnDefinition = "TEXT")
    private String problemesRencontres;

    private LocalDateTime dateAnalyse;

    @OneToOne
    @JoinColumn(name = "event_id", unique = true)
    private Event event;

    // Date automatiquement renseignee lors de la creation de la ligne statistique.
    @PrePersist
    protected void onCreate() {
        dateAnalyse = LocalDateTime.now();
    }
}
