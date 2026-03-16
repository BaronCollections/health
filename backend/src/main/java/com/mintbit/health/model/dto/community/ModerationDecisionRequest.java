package com.mintbit.health.model.dto.community;

import lombok.Data;

@Data
public class ModerationDecisionRequest {

    private String reason;
    private String reviewerId;
}
