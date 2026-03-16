package com.mintbit.health.service;

import com.mintbit.health.model.dto.ocr.OcrParsedField;
import com.mintbit.health.model.dto.ocr.OcrParsedSection;
import com.mintbit.health.model.dto.ocr.OcrResultResponse;
import com.mintbit.health.model.dto.ocr.OcrUploadResponse;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class MockOcrContractService {

    public OcrUploadResponse createUploadResponse(Long assessmentId, String fileName, Long fileSize, String fileType) {
        OcrUploadResponse response = new OcrUploadResponse();
        response.setAssessmentId(assessmentId);
        response.setTaskId(buildTaskId(assessmentId));
        response.setStatus("uploaded");
        response.setNextAction("review_result");
        response.setFileName(fileName);
        response.setFileSize(fileSize);
        response.setFileType(fileType);
        response.setUploadedAt(DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(OffsetDateTime.now(ZoneOffset.UTC)));
        return response;
    }

    public OcrResultResponse createResultResponse(Long assessmentId) {
        OcrResultResponse response = new OcrResultResponse();
        response.setAssessmentId(assessmentId);
        response.setTaskId(buildTaskId(assessmentId));
        response.setStatus("needs_confirmation");
        response.setConfirmationRequired(Boolean.TRUE);
        response.setSourceSummary("mock-ocr-contract");
        response.setSections(List.of(
                createSection("baseline", List.of(
                        createField("vitamin-d", "18 ng/mL", "medium"),
                        createField("hemoglobin", "128 g/L", "high"),
                        createField("ferritin", "21 ng/mL", "medium")
                )),
                createSection("metabolic", List.of(
                        createField("fasting-glucose", "5.8 mmol/L", "high"),
                        createField("triglycerides", "1.92 mmol/L", "high"),
                        createField("hs-crp", "3.2 mg/L", "low")
                ))
        ));
        return response;
    }

    private OcrParsedSection createSection(String id, List<OcrParsedField> fields) {
        OcrParsedSection section = new OcrParsedSection();
        section.setId(id);
        section.setFields(fields);
        return section;
    }

    private OcrParsedField createField(String id, String value, String confidence) {
        OcrParsedField field = new OcrParsedField();
        field.setId(id);
        field.setValue(value);
        field.setConfidence(confidence);
        return field;
    }

    private String buildTaskId(Long assessmentId) {
        return "ocr-task-" + assessmentId;
    }
}
