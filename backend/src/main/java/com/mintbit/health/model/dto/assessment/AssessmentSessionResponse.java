package com.mintbit.health.model.dto.assessment;

import lombok.Data;

@Data
public class AssessmentSessionResponse {

    private Long assessmentId;
    private String status;
    private String currentQuestionId;
    private Integer currentIndex;
    private Integer totalQuestions;
}
