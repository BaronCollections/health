package com.mintbit.health.service;

import com.mintbit.health.model.dto.assessment.AssessmentSessionResponse;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MockAssessmentFlowService {

    private final List<String> questionIds = List.of("B01", "B02", "B03");
    private final Map<Long, Integer> sessionIndexes = new LinkedHashMap<>();
    private long nextAssessmentId = 100L;
    private Long latestAssessmentId = null;

    public AssessmentSessionResponse createSession() {
        long assessmentId = ++nextAssessmentId;
        sessionIndexes.put(assessmentId, 0);
        latestAssessmentId = assessmentId;
        return createResponse(assessmentId, 0);
    }

    public AssessmentSessionResponse submitAnswer(Long assessmentId, Map<String, Object> answer) {
        int currentIndex = sessionIndexes.getOrDefault(assessmentId, 0);
        int nextIndex = Math.min(currentIndex + 1, questionIds.size());
        sessionIndexes.put(assessmentId, nextIndex);
        latestAssessmentId = assessmentId;
        return createResponse(assessmentId, nextIndex);
    }

    public AssessmentSessionResponse resumeLatest() {
        if (latestAssessmentId == null) {
            return null;
        }

        int currentIndex = sessionIndexes.getOrDefault(latestAssessmentId, 0);
        return createResponse(latestAssessmentId, currentIndex);
    }

    private AssessmentSessionResponse createResponse(Long assessmentId, int currentIndex) {
        AssessmentSessionResponse response = new AssessmentSessionResponse();
        response.setAssessmentId(assessmentId);
        response.setTotalQuestions(questionIds.size());

        if (currentIndex >= questionIds.size()) {
            response.setStatus("completed");
            response.setCurrentQuestionId(null);
            response.setCurrentIndex(questionIds.size());
            return response;
        }

        response.setStatus("in_progress");
        response.setCurrentQuestionId(questionIds.get(currentIndex));
        response.setCurrentIndex(currentIndex);
        return response;
    }
}
