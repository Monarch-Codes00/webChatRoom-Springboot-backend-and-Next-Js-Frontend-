package com.nexuslogistics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Waybill {
    private String waybillNumber;
    private String shipmentNumber;
    private String senderName;
    private String recipientName;
    private String originAddress;
    private String destinationAddress;
    private String cargoDescription;
    private double weight;
    private String dimensions;
    private LocalDateTime issuedAt;
    private String barcodeData;
}
