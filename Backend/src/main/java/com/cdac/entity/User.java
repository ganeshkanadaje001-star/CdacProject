package com.cdac.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@AttributeOverride(name = "id", column = @Column(name = "user_id"))
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(callSuper = true, exclude = { "password" })
public class User extends BaseEntity {
	
	@Column(name = "first_name", length = 30)
	private String firstName;
	@Column(name = "last_name", length = 40)
	private String lastName;
	@Column(length = 50, unique = true,nullable = false)
	private String email;
	@Column(length = 300, nullable = false)
	private String password;
	@Column(unique = true, length = 14)
	private String phone;
	@Enumerated(EnumType.STRING) // col type - varchar | enum
	private Role role;
	
	 @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	    @JoinColumn(name = "user_id") // FK in addresses table
	    private List<Address> addresses = new ArrayList<>();
}
