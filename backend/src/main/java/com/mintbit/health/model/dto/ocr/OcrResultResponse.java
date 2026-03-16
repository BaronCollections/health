package com.mintbit.health.model.dto.ocr;

import lombok.Data;

import java.util.List;

@Data
public class OcrResultResponse {

    private Long assessmentId;
    private String taskId;
    private String status;
    private Boolean confirmationRequired;
    private String sourceSummary;
    private List<OcrParsedSection> sections;
}
