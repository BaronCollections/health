package com.mintbit.health.model.dto.account;

import lombok.Data;

@Data
public class CreateFeedbackRequest {

    private String category;
    private String subject;
    private String description;
    private String contact;
    private String screenshotName;
}
