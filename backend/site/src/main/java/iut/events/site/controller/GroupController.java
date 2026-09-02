package iut.events.site.controller;

import iut.events.site.model.StudentGroup;
import iut.events.site.repository.StudentGroupRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
// Controleur des groupes etudiants : expose la liste des groupes pour le front.
public class GroupController {

    private final StudentGroupRepository studentGroupRepository;

    public GroupController(StudentGroupRepository studentGroupRepository) {
        this.studentGroupRepository = studentGroupRepository;
    }

    @GetMapping
    public List<StudentGroup> getAllGroups() {
        return studentGroupRepository.findAll();
    }
}