package iut.events.site.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

// Groupe d'etudiants rattache a un ou plusieurs evenements.
@Entity
@Table(name = "student_groups")
@Getter
@Setter
public class StudentGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomGroupe;

    // Evenements lies au groupe, ignores dans le JSON pour eviter les boucles de serialization.
    @OneToMany(mappedBy = "groupe")
    @JsonIgnore  // ← AJOUTE CE TAG
    private List<Event> events;
}
