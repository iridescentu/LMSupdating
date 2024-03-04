package project.lms.model;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contact")
public class Contact {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long companyId;
	
	@Column(nullable = false)
	private String companyName;

	@Column(nullable = false, unique = true)
	private String phoneNumber;

	@Column(nullable = false, unique = true)
	private String email;

	private String contactPersonName;

	private String address;

	private String website;

	private LocalDate registrationDate;

	private String additionalInfo;

	public Contact() {
		super();
	}

	public Contact(Long companyId, String companyName, String phoneNumber, String email, String contactPersonName,
			String address, String website, LocalDate registrationDate, String additionalInfo) {
		super();
		this.companyId = companyId;
		this.companyName = companyName;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.contactPersonName = contactPersonName;
		this.address = address;
		this.website = website;
		this.registrationDate = registrationDate;
		this.additionalInfo = additionalInfo;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getContactPersonName() {
		return contactPersonName;
	}

	public void setContactPersonName(String contactPersonName) {
		this.contactPersonName = contactPersonName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public LocalDate getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(LocalDate registrationDate) {
		this.registrationDate = registrationDate;
	}

	public String getAdditionalInfo() {
		return additionalInfo;
	}

	public void setAdditionalInfo(String additionalInfo) {
		this.additionalInfo = additionalInfo;
	}
	
}