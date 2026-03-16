package com.mintbit.health.model.dto.account;

import lombok.Data;

@Data
public class FeedbackRecordDto {

    private String id;
    private String category;
    private String subject;
    private String description;
    private String contact;
    private String screenshotName;
    private String status;
    private String submittedAt;
    private String reply;
}
