package project.lms.service;

import java.util.List;

import project.lms.dto.ResponseDto;
import project.lms.model.Contact;

public interface ContactService {

    // Contact 저장
    public ResponseDto<Contact> saveContact(Contact contact);

    // 모든 Contact 조회
    public ResponseDto<List<Contact>> getAllContacts();

    // 특정 Contact 조회 by ID
    public ResponseDto<Contact> getContactById(Long contactId);

    // Contact 업데이트
    public ResponseDto<Contact> updateContact(Long contactId, Contact updatedContact);

    // Contact 삭제
    public ResponseDto<String> deleteContact(Long contactId);

}