package com.payment.feing;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "fresh-basket")
public interface OrderFeignClient {

    @PutMapping("/order/{orderId}/{paymentId}/paid")
    void markOrderAsPaid(@PathVariable("orderId") Long orderId, @PathVariable("paymentId") String paymentId);
}
