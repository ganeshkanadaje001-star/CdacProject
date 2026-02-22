package com.payment.entities;


import java.time.*;

import org.hibernate.annotations.*;

import jakarta.persistence.*;
import lombok.*;

@MappedSuperclass
@Getter
@Setter
@ToString
public abstract class BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@CreationTimestamp 
	@Column(name = "created_on",updatable = false)
	private LocalDate createdOn;
	@UpdateTimestamp 
	@Column(name="last_updated")
	private LocalDateTime lastUpdated;

}
