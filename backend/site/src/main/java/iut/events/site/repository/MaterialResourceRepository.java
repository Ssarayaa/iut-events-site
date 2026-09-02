package iut.events.site.repository;

import iut.events.site.model.MaterialResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Repository des ressources materielles liees aux evenements.
public interface MaterialResourceRepository extends JpaRepository<MaterialResource, Long> {
    // Spring Data genere automatiquement la requete a partir du nom de la methode.
    List<MaterialResource> findByEventId(Long eventId);
}
