package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import com.mintbit.health.model.dto.assessment.AssessmentSessionResponse;
import com.mintbit.health.model.dto.ocr.OcrResultResponse;
import com.mintbit.health.model.dto.ocr.OcrUploadResponse;
import com.mintbit.health.service.MockAssessmentFlowService;
import com.mintbit.health.service.MockOcrContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Tag(name = "健康评估接口")
@RestController
@RequestMapping("/api/assessment")
public class AssessmentController {

    @Autowired
    private MockOcrContractService mockOcrContractService;

    @Autowired
    private MockAssessmentFlowService mockAssessmentFlowService;

    @Operation(summary = "创建评估会话")
    @PostMapping("/create")
    public Result<AssessmentSessionResponse> createAssessment(@RequestBody(required = false) Map<String, String> body) {
        return Result.ok(mockAssessmentFlowService.createSession());
    }

    @Operation(summary = "提交问卷答案（逐题）")
    @PostMapping("/{assessmentId}/answer")
    public Result<AssessmentSessionResponse> submitAnswer(
            @PathVariable Long assessmentId,
            @RequestBody Map<String, Object> answer) {
        return Result.ok(mockAssessmentFlowService.submitAnswer(assessmentId, answer));
    }

    @Operation(summary = "上传体检报告")
    @PostMapping("/{assessmentId}/report/upload")
    public Result<OcrUploadResponse> uploadReport(
            @PathVariable Long assessmentId,
            @RequestParam("file") MultipartFile file) {
        return Result.ok(mockOcrContractService.createUploadResponse(
                assessmentId,
                file.getOriginalFilename() == null ? "report.pdf" : file.getOriginalFilename(),
                file.getSize(),
                file.getContentType() == null ? "application/octet-stream" : file.getContentType()
        ));
    }

    @Operation(summary = "获取OCR解析结果")
    @GetMapping("/{assessmentId}/report/result")
    public Result<OcrResultResponse> getOcrResult(@PathVariable Long assessmentId) {
        return Result.ok(mockOcrContractService.createResultResponse(assessmentId));
    }

    @Operation(summary = "恢复未完成的评估")
    @GetMapping("/resume")
    public Result<AssessmentSessionResponse> resumeAssessment() {
        return Result.ok(mockAssessmentFlowService.resumeLatest());
    }
}
