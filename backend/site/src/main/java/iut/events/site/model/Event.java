package iut.events.site.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

// Entite centrale : represente un evenement stocke dans la table events.
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private LocalTime heureDebut;
    private LocalTime heureFin;   // ← NOUVEAU : heure de fin de l'événement
    private String lieu;
    private String categorie;

    private Double budgetPrevu;
    private Double budgetReel;

    @Column(columnDefinition = "TEXT")
    private String ressourcesMaterielles;

    @Column(columnDefinition = "TEXT")
    private String problemesRencontres;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "referent_id")
    private User referent;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private EventType type;

    @ManyToOne
    @JoinColumn(name = "groupe_id")
    @JsonIgnore
    private StudentGroup groupe;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("event")
    private List<MaterialResource> ressourcesMateriales = new ArrayList<>();

    @OneToOne(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Statistics statistiques;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("event")
    private List<Participation> participations = new ArrayList<>();

    // ===== CONSTRUCTEURS =====
    public Event() {}

    // ===== GETTERS ET SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public LocalTime getHeureDebut() { return heureDebut; }
    public void setHeureDebut(LocalTime heureDebut) { this.heureDebut = heureDebut; }

    public LocalTime getHeureFin() { return heureFin; }
    public void setHeureFin(LocalTime heureFin) { this.heureFin = heureFin; }

    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public Double getBudgetPrevu() { return budgetPrevu; }
    public void setBudgetPrevu(Double budgetPrevu) { this.budgetPrevu = budgetPrevu; }

    public Double getBudgetReel() { return budgetReel; }
    public void setBudgetReel(Double budgetReel) { this.budgetReel = budgetReel; }

    public String getRessourcesMaterielles() { return ressourcesMaterielles; }
    public void setRessourcesMaterielles(String ressourcesMaterielles) { this.ressourcesMaterielles = ressourcesMaterielles; }

    public String getProblemesRencontres() { return problemesRencontres; }
    public void setProblemesRencontres(String problemesRencontres) { this.problemesRencontres = problemesRencontres; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public User getReferent() { return referent; }
    public void setReferent(User referent) { this.referent = referent; }

    public EventType getType() { return type; }
    public void setType(EventType type) { this.type = type; }

    public StudentGroup getGroupe() { return groupe; }
    public void setGroupe(StudentGroup groupe) { this.groupe = groupe; }

    public List<MaterialResource> getRessourcesMateriales() { return ressourcesMateriales; }
    public void setRessourcesMateriales(List<MaterialResource> ressourcesMateriales) { this.ressourcesMateriales = ressourcesMateriales; }

    public Statistics getStatistiques() { return statistiques; }
    public void setStatistiques(Statistics statistiques) { this.statistiques = statistiques; }

    public List<Participation> getParticipations() { return participations; }
    public void setParticipations(List<Participation> participations) { this.participations = participations; }

    public void addParticipation(Participation participation) {
        participations.add(participation);
        participation.setEvent(this);
    }

    public void removeParticipation(Participation participation) {
        participations.remove(participation);
        participation.setEvent(null);
    }
}