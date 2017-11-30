import { TestBed, inject } from '@angular/core/testing';

import { RepairHistoryQueryConnectWithServerServicesService } from './repair-history-query-connect-with-server-services.service';

describe('RepairHistoryQueryConnectWithServerServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairHistoryQueryConnectWithServerServicesService]
    });
  });

  it('should be created', inject([RepairHistoryQueryConnectWithServerServicesService], (service: RepairHistoryQueryConnectWithServerServicesService) => {
    expect(service).toBeTruthy();
  }));
});
