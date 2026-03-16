package com.mintbit.health.model.dto.account;

import lombok.Data;

@Data
public class DeleteRequestDto {

    private String id;
    private String status;
    private String submittedAt;
    private String impactSummary;
}
