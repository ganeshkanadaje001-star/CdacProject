package com.payment.entities;

public enum PaymentStatus {
	  CREATED,        // Razorpay order created, user not paid yet

	    SUCCESS,        // Payment verified successfully

	    FAILED,         // Payment failed or signature invalid

	    CANCELLED 
}
