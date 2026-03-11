package com.mintbit.health.controller;

import com.mintbit.health.model.dto.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "营养画报接口")
@RestController
@RequestMapping("/api/poster")
public class PosterController {

    @Operation(summary = "生成营养画报")
    @PostMapping("/generate/{recommendationId}")
    public Result<Map<String, Object>> generate(@PathVariable Long recommendationId) {
        // TODO: 调用poster-service异步生成画报
        return Result.ok();
    }

    @Operation(summary = "获取画报数据（前端渲染用）")
    @GetMapping("/data/{recommendationId}")
    public Result<Map<String, Object>> getPosterData(@PathVariable Long recommendationId) {
        // TODO: 返回画报JSON数据，供前端Canvas/WebGL渲染
        return Result.ok();
    }

    @Operation(summary = "下载画报PNG/PDF")
    @GetMapping("/download/{recommendationId}")
    public void download(
            @PathVariable Long recommendationId,
            @RequestParam(defaultValue = "png") String format) {
        // TODO: 返回服务端渲染的高清画报文件
    }
}
