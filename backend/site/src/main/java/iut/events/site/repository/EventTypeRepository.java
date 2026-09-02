package iut.events.site.repository;

import iut.events.site.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repository des types d'evenements.
public interface EventTypeRepository extends JpaRepository<EventType, Long> {
    // Recherche un type par son libelle unique.
    Optional<EventType> findByLibelle(String libelle);
}
