package iut.events.site.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

// Entite de liaison : une participation correspond a l'inscription d'un utilisateur a un evenement.
@Entity
@Table(name = "participations")
public class Participation {

    // Statut possible d'une inscription.
    public enum Statut {
        INSCRIT, PRESENT, ABSENT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateInscription;

    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.INSCRIT;

    // Utilisateur inscrit.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("participations")
    private User user;

    // Evenement auquel l'utilisateur participe.
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnoreProperties("participations")
    private Event event;

    // Constructeurs
    public Participation() {}

    // Avant l'enregistrement, complete automatiquement la date et le statut si besoin.
    @PrePersist
    protected void onCreate() {
        if (dateInscription == null) {
            dateInscription = LocalDateTime.now();
        }
        if (statut == null) {
            statut = Statut.INSCRIT;
        }
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDateInscription() { return dateInscription; }
    public void setDateInscription(LocalDateTime dateInscription) { this.dateInscription = dateInscription; }

    public Statut getStatut() { return statut; }
    public void setStatut(Statut statut) { this.statut = statut; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
}
