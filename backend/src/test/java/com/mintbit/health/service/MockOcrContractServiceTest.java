package com.mintbit.health.service;

import com.mintbit.health.model.dto.ocr.OcrResultResponse;
import com.mintbit.health.model.dto.ocr.OcrUploadResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MockOcrContractServiceTest {

    private final MockOcrContractService service = new MockOcrContractService();

    @Test
    void uploadResponseContainsStableContractMetadata() {
        OcrUploadResponse response = service.createUploadResponse(101L, "report.pdf", 2048L, "application/pdf");

        assertEquals(101L, response.getAssessmentId());
        assertEquals("uploaded", response.getStatus());
        assertEquals("review_result", response.getNextAction());
        assertEquals("report.pdf", response.getFileName());
        assertEquals(2048L, response.getFileSize());
        assertEquals("application/pdf", response.getFileType());
        assertNotNull(response.getTaskId());
        assertNotNull(response.getUploadedAt());
    }

    @Test
    void resultResponseContainsReviewableSectionsAndConfidenceFields() {
        OcrResultResponse response = service.createResultResponse(101L);

        assertEquals(101L, response.getAssessmentId());
        assertEquals("needs_confirmation", response.getStatus());
        assertTrue(response.getConfirmationRequired());
        assertNotNull(response.getSections());
        assertFalse(response.getSections().isEmpty());
        assertFalse(response.getSections().get(0).getFields().isEmpty());
        assertFalse(response.getSections().get(0).getId().isBlank());
        assertFalse(response.getSections().get(0).getFields().get(0).getId().isBlank());
        assertFalse(response.getSections().get(0).getFields().get(0).getValue().isBlank());
        assertFalse(response.getSections().get(0).getFields().get(0).getConfidence().isBlank());
    }
}
