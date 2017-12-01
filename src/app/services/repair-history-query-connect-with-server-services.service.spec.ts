import { TestBed, inject } from '@angular/core/testing';

import { RepairHistoryQueryConnectWithServerService } from './repair-history-query-connect-with-server-services.service';

describe('RepairHistoryQueryConnectWithServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairHistoryQueryConnectWithServerService]
    });
  });

  it('should be created', inject([RepairHistoryQueryConnectWithServerService], (service: RepairHistoryQueryConnectWithServerService) => {
    expect(service).toBeTruthy();
  }));
});
