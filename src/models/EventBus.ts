import {Subject, Subscription, Observable} from 'rxjs';
import {filter, tap, concatMap} from 'rxjs/operators';

type Predicate<T> = (item: T) => boolean;

export class EventBus<T> {
  private events: Subject<T>;
  private triggerings: Subject<Observable<void>>;

  constructor() {
    this.events = new Subject();

    this.triggerings = new Subject();
    this.triggerings.pipe(concatMap(t => t)).subscribe();
  }

  listen(matcher: Predicate<T>, handler: (item: T) => void): Subscription {
    return this.events
      .asObservable()
      .pipe(filter(matcher), tap(handler))
      .subscribe();
  }

  trigger(item: T) {
    this.triggerings.next(
      new Observable(notify => {
        this.events.next(item);
        notify.complete();
      })
    );
  }
}
