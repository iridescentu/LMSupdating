package project.lms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.lms.model.Contact;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findAll();

}