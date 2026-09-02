package iut.events.site.repository;

import iut.events.site.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
// Repository des evenements : JpaRepository fournit deja les operations CRUD de base.
public interface EventRepository extends JpaRepository<Event, Long> {

    // Trouve les evenements rattaches a un referent donne.
    List<Event> findByReferentId(Long referentId);

    // Requete personnalisee pour recuperer les evenements a venir, tries par date.
    @Query("SELECT e FROM Event e WHERE e.dateDebut >= CURRENT_DATE ORDER BY e.dateDebut ASC")
    List<Event> findUpcomingEvents();

    // Trouve les evenements dont la date de debut est comprise dans une periode.
    List<Event> findByDateDebutBetween(LocalDate start, LocalDate end);
}
