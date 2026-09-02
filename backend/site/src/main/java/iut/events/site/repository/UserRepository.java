package iut.events.site.repository;

import iut.events.site.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// Repository des utilisateurs : les methodes CRUD standards sont heritees de JpaRepository.
public interface UserRepository extends JpaRepository<User, Long> {
}
