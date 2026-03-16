package com.mintbit.health.service;

import com.mintbit.health.model.dto.account.AccountNotificationDto;
import com.mintbit.health.model.dto.account.AccountFaqCategoryDto;
import com.mintbit.health.model.dto.account.CreateFeedbackRequest;
import com.mintbit.health.model.dto.account.FeedbackRecordDto;
import com.mintbit.health.model.dto.account.FeedbackRecordsResponse;
import com.mintbit.health.model.dto.account.NotificationListResponse;
import com.mintbit.health.model.dto.account.NotificationReadRequest;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MockAccountServiceTest {

    private final MockAccountService service = new MockAccountService();

    @Test
    void notificationListSupportsFilteringAndUnreadSummary() {
        NotificationListResponse allNotifications = service.getNotifications(null);
        NotificationListResponse communityNotifications = service.getNotifications("community");

        assertEquals("all", allNotifications.getFilter());
        assertNotNull(allNotifications.getItems());
        assertEquals(3, allNotifications.getItems().size());
        assertEquals(2, allNotifications.getUnreadCount());

        assertEquals("community", communityNotifications.getFilter());
        assertEquals(1, communityNotifications.getItems().size());
        assertTrue(communityNotifications.getItems().stream()
                .allMatch(item -> "community".equals(item.getType())));
    }

    @Test
    void notificationDetailReturnsStableActionMetadata() {
        AccountNotificationDto detail = service.getNotification("notif-2");

        assertNotNull(detail);
        assertEquals("notif-2", detail.getId());
        assertEquals("community", detail.getType());
        assertEquals("unread", detail.getStatus());
        assertFalse(detail.getTitle().isBlank());
        assertFalse(detail.getBody().isBlank());
        assertEquals("/community/me", detail.getActionHref());
    }

    @Test
    void markNotificationReadUpdatesSingleNotificationState() {
        AccountNotificationDto updated = service.markNotificationRead("notif-1");

        assertEquals("notif-1", updated.getId());
        assertEquals("read", updated.getStatus());

        AccountNotificationDto reloaded = service.getNotification("notif-1");
        assertEquals("read", reloaded.getStatus());
    }

    @Test
    void batchReadMarksEveryRequestedNotificationAsRead() {
        NotificationReadRequest request = new NotificationReadRequest();
        request.setIds(List.of("notif-1", "notif-2"));

        NotificationListResponse response = service.markNotificationsRead(request);

        assertEquals("all", response.getFilter());
        assertEquals(0, response.getUnreadCount());
        assertTrue(response.getItems().stream().allMatch(item -> "read".equals(item.getStatus())));
    }

    @Test
    void faqCategoriesExposeSeededHelpModules() {
        List<AccountFaqCategoryDto> categories = service.getFaqCategories();

        assertEquals(2, categories.size());
        assertEquals("assessment", categories.get(0).getId());
        assertFalse(categories.get(0).getItems().isEmpty());
        assertFalse(categories.get(0).getItems().get(0).getQuestion().isBlank());
    }

    @Test
    void feedbackRecordsExposeOpenAndRespondedStates() {
        FeedbackRecordsResponse response = service.getFeedbackRecords();

        assertEquals(2, response.getRecords().size());
        assertTrue(response.getRecords().stream().anyMatch(record -> "in_review".equals(record.getStatus())));
        assertTrue(response.getRecords().stream().anyMatch(record -> "responded".equals(record.getStatus())));
    }

    @Test
    void createFeedbackAppendsSubmittedRecordToHistory() {
        CreateFeedbackRequest request = new CreateFeedbackRequest();
        request.setCategory("通知体验");
        request.setSubject("希望支持社区互动批量清理");
        request.setDescription("需要在账户中心里更快处理消息。");
        request.setContact("mintbit@example.com");
        request.setScreenshotName("notification-state.png");

        FeedbackRecordDto created = service.createFeedback(request);

        assertNotNull(created.getId());
        assertEquals("submitted", created.getStatus());
        assertEquals("通知体验", created.getCategory());
        assertEquals("希望支持社区互动批量清理", created.getSubject());

        FeedbackRecordsResponse response = service.getFeedbackRecords();
        assertTrue(response.getRecords().stream().anyMatch(record -> created.getId().equals(record.getId())));
    }
}
