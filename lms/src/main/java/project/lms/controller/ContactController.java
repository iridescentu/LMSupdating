package project.lms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import project.lms.dto.ResponseDto;
import project.lms.model.Contact;
import project.lms.service.ContactService;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT })
public class ContactController {

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/save")
    public ResponseEntity<ResponseDto<Contact>> saveContact(@RequestBody Contact contact) {
        ResponseDto<Contact> response = contactService.saveContact(contact);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<ResponseDto<Contact>> getContactById(@PathVariable Long contactId) {
        ResponseDto<Contact> response = contactService.getContactById(contactId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<Contact>>> getAllContacts() {
        ResponseDto<List<Contact>> response = contactService.getAllContacts();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/update/{contactId}")
    public ResponseEntity<ResponseDto<Contact>> updateContact(
            @PathVariable Long contactId,
            @RequestBody Contact updatedContact) {
        ResponseDto<Contact> response = contactService.updateContact(contactId, updatedContact);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/delete/{contactId}")
    public ResponseEntity<ResponseDto<String>> deleteContact(@PathVariable Long contactId) {
        ResponseDto<String> response = contactService.deleteContact(contactId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}