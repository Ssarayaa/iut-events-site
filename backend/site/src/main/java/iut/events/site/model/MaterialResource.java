package iut.events.site.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// Ressource materielle associee a un evenement, avec quantite et cout unitaire.
@Entity
@Table(name = "material_resources")
@Getter
@Setter
public class MaterialResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private Integer quantite;
    private Double coutUnitaire;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // Calcule le cout total de cette ressource.
    public Double getTotal() {
        return quantite * coutUnitaire;
    }
}
