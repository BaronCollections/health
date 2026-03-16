package com.mintbit.health.model.dto.account;

import lombok.Data;

@Data
public class ExportRequestDto {

    private String id;
    private String requestedAt;
    private String status;
    private String scopeSummary;
}
