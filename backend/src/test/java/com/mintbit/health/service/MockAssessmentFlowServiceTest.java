package com.mintbit.health.service;

import com.mintbit.health.model.dto.assessment.AssessmentSessionResponse;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class MockAssessmentFlowServiceTest {

    private final MockAssessmentFlowService service = new MockAssessmentFlowService();

    @Test
    void createSessionStartsAtTheFirstQuestion() {
        AssessmentSessionResponse response = service.createSession();

        assertNotNull(response.getAssessmentId());
        assertEquals("in_progress", response.getStatus());
        assertEquals("B01", response.getCurrentQuestionId());
        assertEquals(0, response.getCurrentIndex());
        assertEquals(30, response.getTotalQuestions());
    }

    @Test
    void submitAnswerAdvancesToTheNextQuestion() {
        AssessmentSessionResponse created = service.createSession();

        AssessmentSessionResponse response = service.submitAnswer(
                created.getAssessmentId(),
                Map.of("questionId", "B01", "value", "female")
        );

        assertEquals(created.getAssessmentId(), response.getAssessmentId());
        assertEquals("in_progress", response.getStatus());
        assertEquals("B02", response.getCurrentQuestionId());
        assertEquals(1, response.getCurrentIndex());
    }

    @Test
    void resumeReturnsTheLatestActiveAssessment() {
        AssessmentSessionResponse created = service.createSession();
        service.submitAnswer(created.getAssessmentId(), Map.of("questionId", "B01", "value", "female"));

        AssessmentSessionResponse resumed = service.resumeLatest();

        assertEquals(created.getAssessmentId(), resumed.getAssessmentId());
        assertEquals("B02", resumed.getCurrentQuestionId());
        assertEquals(1, resumed.getCurrentIndex());
    }
}
