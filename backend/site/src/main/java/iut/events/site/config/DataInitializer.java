package iut.events.site.config;

import iut.events.site.model.*;
import iut.events.site.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * 📌 DataInitializer - GÉNÉRATEUR DE DONNÉES DE TEST
 *
 * ⚠️ ACTUELLEMENT : INACTIF
 *
 * 🔄 Comment réactiver ?
 * 1. Décommenter la ligne "import org.springframework.stereotype.Component;"
 * 2. Décommenter la ligne "@Component" ci-dessous
 * 3. Redémarrer Spring Boot
 *
 * 📊 Comptes de test disponibles :
 *    - ADMIN: admin@iut.fr / admin123
 *    - REFERENT: sophie.martin@iut.fr / password123
 *    - ENSEIGNANT: emma.petit@iut.fr / password123
 *    - ETUDIANT: lucas.dupont@iut.fr / password123
 *
 * 🗃️ Données créées :
 *    - 3 événements (Nuit de l'Info, JPO, Hackathon)
 *    - Types d'événements (Conférence, Événement, Séminaire, Sortie, Autre)
 *    - Groupes étudiants (Groupe 1, Groupe 2, Groupe 3)
 *    - Ressources matérielles (Pizzas, Boissons)
 *    - Participations (2 inscriptions)
 *    - Statistiques (1 jeu de données)
 */
@Component 
public class DataInitializer implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventTypeRepository eventTypeRepository;
    private final StudentGroupRepository studentGroupRepository;
    private final MaterialResourceRepository materialResourceRepository;
    private final ParticipationRepository participationRepository;
    private final StatisticsRepository statisticsRepository;

    public DataInitializer(EventRepository eventRepository,
                           UserRepository userRepository,
                           EventTypeRepository eventTypeRepository,
                           StudentGroupRepository studentGroupRepository,
                           MaterialResourceRepository materialResourceRepository,
                           ParticipationRepository participationRepository,
                           StatisticsRepository statisticsRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.eventTypeRepository = eventTypeRepository;
        this.studentGroupRepository = studentGroupRepository;
        this.materialResourceRepository = materialResourceRepository;
        this.participationRepository = participationRepository;
        this.statisticsRepository = statisticsRepository;
    }

    @Override
    public void run(String... args) {

        System.out.println("🗑️ Nettoyage des données existantes...");

        statisticsRepository.deleteAll();
        materialResourceRepository.deleteAll();
        participationRepository.deleteAll();
        eventRepository.deleteAll();
        eventTypeRepository.deleteAll();
        studentGroupRepository.deleteAll();
        userRepository.deleteAll();

        System.out.println("✅ Nettoyage terminé");

        // 1️⃣ TYPES D'ÉVÉNEMENTS
        EventType conference = new EventType();
        conference.setLibelle("Conférence");
        EventType evenement = new EventType();
        evenement.setLibelle("Événement");
        EventType seminaire = new EventType();
        seminaire.setLibelle("Séminaire");
        EventType sortie = new EventType();
        sortie.setLibelle("Sortie");
        EventType autre = new EventType();
        autre.setLibelle("Autre");

        eventTypeRepository.saveAll(List.of(conference, evenement, seminaire, sortie, autre));

        // 2️⃣ GROUPES ÉTUDIANTS - NOMS GÉNÉRIQUES
        StudentGroup groupe1 = new StudentGroup();
        groupe1.setNomGroupe("Groupe 1");
        StudentGroup groupe2 = new StudentGroup();
        groupe2.setNomGroupe("Groupe 2");
        StudentGroup groupe3 = new StudentGroup();
        groupe3.setNomGroupe("Groupe 3");

        studentGroupRepository.saveAll(List.of(groupe1, groupe2, groupe3));

        // 3️⃣ UTILISATEURS (COMPTES DE TEST)
        User admin = new User();
        admin.setNom("Admin");
        admin.setPrenom("System");
        admin.setEmail("admin@iut.fr");
        admin.setMotDePasse("admin123");
        admin.setRole("ADMIN");

        User referent = new User();
        referent.setNom("Martin");
        referent.setPrenom("Sophie");
        referent.setEmail("sophie.martin@iut.fr");
        referent.setMotDePasse("password123");
        referent.setRole("REFERENT");

        User enseignant = new User();
        enseignant.setNom("Petit");
        enseignant.setPrenom("Emma");
        enseignant.setEmail("emma.petit@iut.fr");
        enseignant.setMotDePasse("password123");
        enseignant.setRole("ENSEIGNANT");

        User etudiant = new User();
        etudiant.setNom("Dupont");
        etudiant.setPrenom("Lucas");
        etudiant.setEmail("lucas.dupont@iut.fr");
        etudiant.setMotDePasse("password123");
        etudiant.setRole("ETUDIANT");

        userRepository.saveAll(List.of(admin, referent, enseignant, etudiant));

        // 4️⃣ ÉVÉNEMENTS DE DÉMONSTRATION
        Event nuitInfo = new Event();
        nuitInfo.setTitre("Nuit de l'Info 2026");
        nuitInfo.setDescription("Compétition nationale de programmation qui réunit étudiants, enseignants et entreprises pour travailler ensemble sur un sujet informatique durant toute une nuit.");
        nuitInfo.setDateDebut(LocalDate.of(2026, 12, 4));
        nuitInfo.setDateFin(LocalDate.of(2026, 12, 5));
        nuitInfo.setHeureDebut(LocalTime.of(18, 0));
        nuitInfo.setLieu("IUT de Meaux");
        nuitInfo.setCategorie("Événement");
        nuitInfo.setBudgetPrevu(1500.0);
        nuitInfo.setBudgetReel(1420.0);
        nuitInfo.setRessourcesMaterielles("Amphi, PC portables, pizzas, boissons, multiprises");
        nuitInfo.setProblemesRencontres("Légère coupure réseau à 3h du matin");
        nuitInfo.setReferent(referent);
        nuitInfo.setType(evenement);
        nuitInfo.setGroupe(groupe1);
        eventRepository.save(nuitInfo);

        Event jpoEvent = new Event();
        jpoEvent.setTitre("Journée Portes Ouvertes 2026");
        jpoEvent.setDescription("Présentation des formations de l'IUT aux futurs étudiants, visites guidées des locaux et ateliers animés.");
        jpoEvent.setDateDebut(LocalDate.of(2026, 3, 14));
        jpoEvent.setDateFin(LocalDate.of(2026, 3, 14));
        jpoEvent.setHeureDebut(LocalTime.of(9, 0));
        jpoEvent.setLieu("IUT de Meaux");
        jpoEvent.setCategorie("Sortie");
        jpoEvent.setBudgetPrevu(800.0);
        jpoEvent.setBudgetReel(750.0);
        jpoEvent.setRessourcesMaterielles("Kakemonos, guides imprimés, café, viennoiseries");
        jpoEvent.setProblemesRencontres("Léger dépassement sur la restauration");
        jpoEvent.setReferent(referent);
        jpoEvent.setType(sortie);
        jpoEvent.setGroupe(groupe2);
        eventRepository.save(jpoEvent);

        Event hackathonEvent = new Event();
        hackathonEvent.setTitre("Hackathon GreenTech");
        hackathonEvent.setDescription("Création d'applications éco-responsables en 48h.");
        hackathonEvent.setDateDebut(LocalDate.of(2026, 5, 20));
        hackathonEvent.setDateFin(LocalDate.of(2026, 5, 22));
        hackathonEvent.setHeureDebut(LocalTime.of(10, 0));
        hackathonEvent.setLieu("IUT de Meaux");
        hackathonEvent.setCategorie("Événement");
        hackathonEvent.setBudgetPrevu(2000.0);
        hackathonEvent.setBudgetReel(0.0);
        hackathonEvent.setRessourcesMaterielles("Salles, connexion wifi, cafétéria");
        hackathonEvent.setProblemesRencontres("");
        hackathonEvent.setReferent(enseignant);
        hackathonEvent.setType(autre);
        hackathonEvent.setGroupe(groupe3);
        eventRepository.save(hackathonEvent);

        // 5️⃣ RESSOURCES MATÉRIELLES
        MaterialResource pizzas = new MaterialResource();
        pizzas.setNom("Pizzas");
        pizzas.setQuantite(50);
        pizzas.setCoutUnitaire(12.0);
        pizzas.setEvent(nuitInfo);

        MaterialResource boissons = new MaterialResource();
        boissons.setNom("Boissons");
        boissons.setQuantite(100);
        boissons.setCoutUnitaire(2.0);
        boissons.setEvent(nuitInfo);

        materialResourceRepository.saveAll(List.of(pizzas, boissons));

        // 6️⃣ PARTICIPATIONS
        Participation participation1 = new Participation();
        participation1.setUser(etudiant);
        participation1.setEvent(nuitInfo);
        participation1.setStatut(Participation.Statut.INSCRIT);

        Participation participation2 = new Participation();
        participation2.setUser(etudiant);
        participation2.setEvent(jpoEvent);
        participation2.setStatut(Participation.Statut.PRESENT);

        participationRepository.saveAll(List.of(participation1, participation2));

        // 7️⃣ STATISTIQUES
        Statistics stats = new Statistics();
        stats.setNbParticipants(45);
        stats.setEcartBudget(-80.0);
        stats.setProblemesRencontres("Coupure réseau à 3h du matin");
        stats.setEvent(nuitInfo);
        statisticsRepository.save(stats);

        System.out.println("🎉 Initialisation terminée !");
        System.out.println("📊 Comptes créés :");
        System.out.println("   - ADMIN: admin@iut.fr / admin123");
        System.out.println("   - REFERENT: sophie.martin@iut.fr / password123");
        System.out.println("   - ENSEIGNANT: emma.petit@iut.fr / password123");
        System.out.println("   - ETUDIANT: lucas.dupont@iut.fr / password123");
    }
}