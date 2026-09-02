package iut.events.site.repository;

import iut.events.site.model.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repository des groupes etudiants.
public interface StudentGroupRepository extends JpaRepository<StudentGroup, Long> {
    // Recherche un groupe par son nom.
    Optional<StudentGroup> findByNomGroupe(String nomGroupe);
}
