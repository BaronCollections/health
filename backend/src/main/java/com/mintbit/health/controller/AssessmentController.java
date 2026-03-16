package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import com.mintbit.health.model.dto.ocr.OcrResultResponse;
import com.mintbit.health.model.dto.ocr.OcrUploadResponse;
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

    @Operation(summary = "创建评估会话")
    @PostMapping("/create")
    public Result<Map<String, Object>> createAssessment(@RequestBody Map<String, String> body) {
        // TODO: 创建新评估，返回第一个问题
        return Result.ok();
    }

    @Operation(summary = "提交问卷答案（逐题）")
    @PostMapping("/{assessmentId}/answer")
    public Result<Map<String, Object>> submitAnswer(
            @PathVariable Long assessmentId,
            @RequestBody Map<String, Object> answer) {
        // TODO: 提交当前题答案，返回下一题（含AI动态分支）
        return Result.ok();
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
    public Result<Map<String, Object>> resumeAssessment() {
        // TODO: 查找用户最近未完成的评估，断点续答
        return Result.ok();
    }
}
