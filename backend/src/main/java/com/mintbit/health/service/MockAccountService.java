package com.mintbit.health.service;

import com.mintbit.health.model.dto.account.AccountNotificationDto;
import com.mintbit.health.model.dto.account.AccountFaqCategoryDto;
import com.mintbit.health.model.dto.account.AccountFaqItemDto;
import com.mintbit.health.model.dto.account.CreateFeedbackRequest;
import com.mintbit.health.model.dto.account.FeedbackRecordDto;
import com.mintbit.health.model.dto.account.FeedbackRecordsResponse;
import com.mintbit.health.model.dto.account.NotificationListResponse;
import com.mintbit.health.model.dto.account.NotificationReadRequest;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MockAccountService {

    private final Map<String, AccountNotificationDto> notificationsById = new LinkedHashMap<>();
    private final List<AccountFaqCategoryDto> faqCategories = new java.util.ArrayList<>();
    private final Map<String, FeedbackRecordDto> feedbackRecordsById = new LinkedHashMap<>();

    public MockAccountService() {
        seedNotifications();
        seedFaqCategories();
        seedFeedbackRecords();
    }

    public NotificationListResponse getNotifications(String type) {
        String normalizedFilter = type == null || type.isBlank() ? "all" : type;
        List<AccountNotificationDto> items = notificationsById.values().stream()
                .filter(notification -> "all".equals(normalizedFilter) || normalizedFilter.equals(notification.getType()))
                .map(this::copyNotification)
                .toList();

        NotificationListResponse response = new NotificationListResponse();
        response.setFilter(normalizedFilter);
        response.setUnreadCount((int) items.stream()
                .filter(notification -> "unread".equals(notification.getStatus()))
                .count());
        response.setItems(items);
        return response;
    }

    public AccountNotificationDto getNotification(String notificationId) {
        return copyNotification(requireNotification(notificationId));
    }

    public AccountNotificationDto markNotificationRead(String notificationId) {
        AccountNotificationDto notification = requireNotification(notificationId);
        notification.setStatus("read");
        return copyNotification(notification);
    }

    public NotificationListResponse markNotificationsRead(NotificationReadRequest request) {
        List<String> ids = request == null || request.getIds() == null ? List.of() : request.getIds();
        ids.forEach(id -> requireNotification(id).setStatus("read"));
        return getNotifications(null);
    }

    public List<AccountFaqCategoryDto> getFaqCategories() {
        return faqCategories.stream().map(this::copyFaqCategory).toList();
    }

    public FeedbackRecordsResponse getFeedbackRecords() {
        FeedbackRecordsResponse response = new FeedbackRecordsResponse();
        response.setRecords(feedbackRecordsById.values().stream().map(this::copyFeedbackRecord).toList());
        return response;
    }

    public FeedbackRecordDto createFeedback(CreateFeedbackRequest request) {
        FeedbackRecordDto record = new FeedbackRecordDto();
        record.setId("fb-" + UUID.randomUUID());
        record.setCategory(blankToDefault(request.getCategory(), "通知体验"));
        record.setSubject(blankToDefault(request.getSubject(), "账户中心反馈"));
        record.setDescription(blankToDefault(request.getDescription(), ""));
        record.setContact(blankToDefault(request.getContact(), ""));
        record.setScreenshotName(blankToDefault(request.getScreenshotName(), null));
        record.setStatus("submitted");
        record.setSubmittedAt(OffsetDateTime.now().toLocalDateTime().toString());

        feedbackRecordsById.put(record.getId(), record);
        return copyFeedbackRecord(record);
    }

    private AccountNotificationDto requireNotification(String notificationId) {
        AccountNotificationDto notification = notificationsById.get(notificationId);
        if (notification == null) {
            throw new IllegalArgumentException("Notification not found: " + notificationId);
        }
        return notification;
    }

    private AccountNotificationDto copyNotification(AccountNotificationDto source) {
        AccountNotificationDto target = new AccountNotificationDto();
        target.setId(source.getId());
        target.setType(source.getType());
        target.setStatus(source.getStatus());
        target.setTitle(source.getTitle());
        target.setPreview(source.getPreview());
        target.setBody(source.getBody());
        target.setRelativeTime(source.getRelativeTime());
        target.setActionHref(source.getActionHref());
        return target;
    }

    private AccountFaqCategoryDto copyFaqCategory(AccountFaqCategoryDto source) {
        AccountFaqCategoryDto target = new AccountFaqCategoryDto();
        target.setId(source.getId());
        target.setTitle(source.getTitle());
        target.setItems(source.getItems().stream().map(this::copyFaqItem).toList());
        return target;
    }

    private AccountFaqItemDto copyFaqItem(AccountFaqItemDto source) {
        AccountFaqItemDto target = new AccountFaqItemDto();
        target.setQuestion(source.getQuestion());
        target.setAnswer(source.getAnswer());
        return target;
    }

    private FeedbackRecordDto copyFeedbackRecord(FeedbackRecordDto source) {
        FeedbackRecordDto target = new FeedbackRecordDto();
        target.setId(source.getId());
        target.setCategory(source.getCategory());
        target.setSubject(source.getSubject());
        target.setDescription(source.getDescription());
        target.setContact(source.getContact());
        target.setScreenshotName(source.getScreenshotName());
        target.setStatus(source.getStatus());
        target.setSubmittedAt(source.getSubmittedAt());
        target.setReply(source.getReply());
        return target;
    }

    private void seedNotifications() {
        notificationsById.put("notif-1", createNotification(
                "notif-1",
                "system",
                "unread",
                "Your data export package has started generating",
                "The export request is accepted. You will see another reminder here when it is ready.",
                "We have received your export request and it is currently generating. When it is ready, return to the account center to review the delivery method and expiration window.",
                "10m ago",
                "/profile/privacy/export"
        ));
        notificationsById.put("notif-2", createNotification(
                "notif-2",
                "community",
                "unread",
                "Your post moderation status has changed",
                "One post in the Stress reset circle moved from pending to approved.",
                "Your progress post in the Stress reset circle has been approved and is now visible in the public community feed.",
                "35m ago",
                "/community/me"
        ));
        notificationsById.put("notif-3", createNotification(
                "notif-3",
                "checkin",
                "read",
                "Today's check-in reminder is ready",
                "The current plan suggests logging today's intake about 30 minutes after dinner.",
                "Based on your current plan rhythm, the system suggests finishing today's supplement check-in within 30 minutes after dinner for steadier tracking.",
                "Today",
                "/checkin"
        ));
    }

    private AccountNotificationDto createNotification(
            String id,
            String type,
            String status,
            String title,
            String preview,
            String body,
            String relativeTime,
            String actionHref
    ) {
        AccountNotificationDto notification = new AccountNotificationDto();
        notification.setId(id);
        notification.setType(type);
        notification.setStatus(status);
        notification.setTitle(title);
        notification.setPreview(preview);
        notification.setBody(body);
        notification.setRelativeTime(relativeTime);
        notification.setActionHref(actionHref);
        return notification;
    }

    private void seedFaqCategories() {
        faqCategories.add(createFaqCategory(
                "assessment",
                "Assessment and report",
                List.of(createFaqItem(
                        "Why do the report page and OCR enrichment both exist?",
                        "The questionnaire is the base input, while OCR enrichment strengthens it with past checkup data so the explanation can be more complete."
                ))
        ));
        faqCategories.add(createFaqCategory(
                "privacy",
                "Privacy and data",
                List.of(createFaqItem(
                        "What data is included in an export request?",
                        "Phase 1 export scope covers assessment history, OCR enrichment, check-in records, and community-record summaries."
                ))
        ));
    }

    private void seedFeedbackRecords() {
        feedbackRecordsById.put("fb-1", createFeedbackRecord(
                "fb-1",
                "OCR recognition",
                "I want manual field ordering on the OCR confirmation page",
                "I want drag-and-drop field ordering on the OCR confirmation page to reduce manual review time.",
                "mintbit@example.com",
                "ocr-order.png",
                "in_review",
                "2026-03-15 18:20",
                "The team has received this and is reviewing form-ordering support."
        ));
        feedbackRecordsById.put("fb-2", createFeedbackRecord(
                "fb-2",
                "Notification experience",
                "Please separate community interactions from system notices",
                "The current notification stream needs clearer separation between system notices, community interactions, and check-in reminders.",
                "mintbit@example.com",
                null,
                "responded",
                "2026-03-14 10:12",
                "This is included in the account-center platformization node."
        ));
    }

    private AccountFaqCategoryDto createFaqCategory(String id, String title, List<AccountFaqItemDto> items) {
        AccountFaqCategoryDto category = new AccountFaqCategoryDto();
        category.setId(id);
        category.setTitle(title);
        category.setItems(items);
        return category;
    }

    private AccountFaqItemDto createFaqItem(String question, String answer) {
        AccountFaqItemDto item = new AccountFaqItemDto();
        item.setQuestion(question);
        item.setAnswer(answer);
        return item;
    }

    private FeedbackRecordDto createFeedbackRecord(
            String id,
            String category,
            String subject,
            String description,
            String contact,
            String screenshotName,
            String status,
            String submittedAt,
            String reply
    ) {
        FeedbackRecordDto record = new FeedbackRecordDto();
        record.setId(id);
        record.setCategory(category);
        record.setSubject(subject);
        record.setDescription(description);
        record.setContact(contact);
        record.setScreenshotName(screenshotName);
        record.setStatus(status);
        record.setSubmittedAt(submittedAt);
        record.setReply(reply);
        return record;
    }

    private String blankToDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }
}
