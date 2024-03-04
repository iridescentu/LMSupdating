package project.lms.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.lms.dto.ResponseDto;
import project.lms.enumstatus.ResultCode;
import project.lms.exception.InvalidRequestException;
import project.lms.model.Contact;
import project.lms.repository.ContactRepository;
import project.lms.service.ContactService;

import java.util.List;
import java.util.Optional;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    @Autowired
    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional
    @Override
    public ResponseDto<Contact> saveContact(Contact contact) {
        try {
            Contact savedContact = contactRepository.save(contact);
            return new ResponseDto<>(ResultCode.SUCCESS.name(), savedContact, "Contact가 성공적으로 저장되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            throw new InvalidRequestException("Contact 저장 중 오류가 발생하였습니다.", e.getMessage());
        }
    }

    @Override
    public ResponseDto<List<Contact>> getAllContacts() {
        List<Contact> contacts = contactRepository.findAll();
        return new ResponseDto<>(ResultCode.SUCCESS.name(), contacts, "모든 Contact를 성공적으로 조회하였습니다.");
    }

    @Override
    public ResponseDto<Contact> getContactById(Long contactId) {
        Optional<Contact> optionalContact = contactRepository.findById(contactId);
        return optionalContact.map(contact -> new ResponseDto<>(ResultCode.SUCCESS.name(), contact, "ID " + contactId + "에 해당하는 Contact를 성공적으로 조회하였습니다."))
                .orElseGet(() -> new ResponseDto<>(ResultCode.ERROR.name(), null, "해당 ID의 Contact를 찾을 수 없습니다."));
    }

    @Transactional
    @Override
    public ResponseDto<Contact> updateContact(Long contactId, Contact updatedContact) {
        try {
            Optional<Contact> optionalContact = contactRepository.findById(contactId);

            if (optionalContact.isPresent()) {
                Contact existingContact = optionalContact.get();

                // Contact 업데이트 로직
                existingContact.setCompanyName(updatedContact.getCompanyName());
                existingContact.setEmail(updatedContact.getEmail());
                existingContact.setPhoneNumber(updatedContact.getPhoneNumber());
                existingContact.setContactPersonName(updatedContact.getContactPersonName());
                existingContact.setAddress(updatedContact.getAddress());
                existingContact.setWebsite(updatedContact.getWebsite());
                existingContact.setRegistrationDate(updatedContact.getRegistrationDate());
                existingContact.setAdditionalInfo(updatedContact.getAdditionalInfo());

                contactRepository.save(existingContact);

                return new ResponseDto<>(ResultCode.SUCCESS.name(), null, "Contact가 성공적으로 업데이트되었습니다.");
            } else {
                return new ResponseDto<>(ResultCode.ERROR.name(), null, "해당 ID의 Contact를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new InvalidRequestException("Contact 업데이트 중 오류가 발생하였습니다.", e.getMessage());
        }
    }

    @Transactional
    @Override
    public ResponseDto<String> deleteContact(Long contactId) {
        try {
            Optional<Contact> optionalContact = contactRepository.findById(contactId);

            if (optionalContact.isPresent()) {
                contactRepository.deleteById(contactId);
                return new ResponseDto<>(ResultCode.SUCCESS.name(), null, "Contact가 성공적으로 삭제되었습니다.");
            } else {
                return new ResponseDto<>(ResultCode.ERROR.name(), null, "해당 ID의 Contact를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new InvalidRequestException("Contact 삭제 중 오류가 발생하였습니다.", e.getMessage());
        }
    }
}