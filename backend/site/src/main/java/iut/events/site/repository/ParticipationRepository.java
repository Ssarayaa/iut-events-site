package iut.events.site.repository;

import iut.events.site.model.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// Repository des participations : permet de sauvegarder et supprimer les inscriptions.
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
}
