package iut.events.site.repository;

import iut.events.site.model.Statistics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repository des statistiques associees aux evenements.
public interface StatisticsRepository extends JpaRepository<Statistics, Long> {
    // Une statistique etant liee a un evenement, on peut la retrouver depuis l'id de cet evenement.
    Optional<Statistics> findByEventId(Long eventId);
}
